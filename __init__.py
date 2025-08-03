import os

os.makedirs("src/models", exist_ok=True)
os.makedirs("src/routes", exist_ok=True)

open("src/__init__.py", "a").close()
open("src/models/__init__.py", "a").close()
open("src/routes/__init__.py", "a").close()