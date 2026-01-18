#!/usr/bin/env bash
# exit on error
set -o errexit

pip install --upgrade pip --no-cache-dir
pip install -r requirements.txt --no-cache-dir
