"""Keep complete benchmark records while retrying Windows file replacement."""
from pathlib import Path
import time


def replace_file(temporary, destination):
    """Atomically replace a file, allowing brief Windows sharing/access errors.

    Never delete the destination first. A persistent error preserves both the
    previous complete record and the temporary output and is still reported.
    """
    temporary = Path(temporary)
    for attempt in range(8):
        try:
            temporary.replace(destination)
            return
        except OSError as exc:
            if getattr(exc, 'winerror', None) not in (5, 32, 33) or attempt == 7:
                raise
            time.sleep(.01 * 2**attempt)
