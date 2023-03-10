#!/bin/bash

ffmpeg -i $1 -vf crop=316:225:0:0 ../src/images/top-$1
ffmpeg -i $1 -vf crop=316:58:0:224 ../src/images/skill1-$1
ffmpeg -i $1 -vf crop=316:58:0:282 ../src/images/skill2-$1
ffmpeg -i $1 -vf crop=316:103:0:340 ../src/images/skill3-$1
