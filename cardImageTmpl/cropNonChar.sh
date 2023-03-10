#!/bin/bash

ffmpeg -i $1 -vf crop=316:361:0:0 ../src/images/top-$1
ffmpeg -i $1 -vf crop=316:83:0:360 ../src/images/skill-$1
