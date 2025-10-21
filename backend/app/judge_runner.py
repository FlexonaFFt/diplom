import os
import shlex
import tempfile
import time
from typing import Tuple

from docker import from_env
from docker.errors import APIError, DockerException, NotFound

from app.config import settings

_docker_client = None


def _get_client():
    global _docker_client
    if _docker_client is None:
        _docker_client = from_env()
    return _docker_client


def ensure_image(name: str):
    client = _get_client()
    client.images.get(name)


def run_python_in_sandbox(code: str, input_text: str, timeout_sec: int) -> Tuple[str, str, str, int, str]:
    """
    Execute user code in the sandbox container with strict resource limits.
    Returns tuple of (status, stdout_text, stderr_text, elapsed_ms, exit_code_str).
    """
    try:
        ensure_image(settings.JUDGE_IMAGE)
    except NotFound:
        return "error", "", f"Docker image '{settings.JUDGE_IMAGE}' is missing", 0, "-1"
    except DockerException:
        return "error", "", "Docker daemon is unavailable", 0, "-1"

    os.makedirs(settings.WORKDIR_HOST, exist_ok=True)
    workdir = tempfile.mkdtemp(prefix="judge_", dir=settings.WORKDIR_HOST)
    code_path = os.path.join(workdir, "solution.py")
    inp_path = os.path.join(workdir, "input.txt")

    with open(code_path, "w", encoding="utf-8") as f:
        f.write(code)
    with open(inp_path, "w", encoding="utf-8") as f:
        f.write(input_text)

    command = "/bin/sh -lc " + shlex.quote("python /workspace/solution.py < /workspace/input.txt")
    start = time.time()
    status = "ok"
    stderr_txt = ""
    stdout_txt = ""
    exit_code = 0

    client = _get_client()

    try:
        container = client.containers.run(
            settings.JUDGE_IMAGE,
            command=command,
            detach=True,
            stdin_open=False,
            tty=False,
            network_mode="none",
            read_only=True,
            security_opt=["no-new-privileges:true"],
            mem_limit=settings.MEM_LIMIT,
            nano_cpus=settings.NANO_CPUS,
            pids_limit=settings.PIDS_LIMIT,
            cap_drop=["ALL"],
            tmpfs={"/tmp": ""},
            volumes={workdir: {"bind": "/workspace", "mode": "ro"}},
            user="1000:1000",
            working_dir="/workspace",
        )
        try:
            result = container.wait(timeout=timeout_sec)
            exit_code = int(result.get("StatusCode", 124))
            logs = container.logs(stdout=True, stderr=False)
            stdout_txt = logs.decode("utf-8", errors="replace")
        except Exception:
            status = "tle"
            try:
                container.kill()
            except Exception:
                pass
        finally:
            try:
                stderr_logs = container.logs(stdout=False, stderr=True)
                if stderr_logs:
                    stderr_txt = stderr_logs.decode("utf-8", errors="replace")
            except Exception:
                pass
            try:
                container.remove(force=True)
            except Exception:
                pass
    except APIError as exc:
        status = "error"
        stderr_txt = f"Docker API error: {exc}"

    elapsed_ms = int((time.time() - start) * 1000)
    if status == "ok" and exit_code != 0:
        status = "runtime_error"
    return status, stdout_txt, stderr_txt, elapsed_ms, str(exit_code)
