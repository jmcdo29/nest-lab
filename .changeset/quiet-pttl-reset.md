---
'@nest-lab/throttler-storage-redis': patch
---

Stop re-arming the hit counter's expiry when `PTTL` returns 0. A hit in the
key's last millisecond no longer carries the old count into a fresh window.
