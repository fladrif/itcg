#!/bin/bash

ffmpeg -i $1 -vf crop=316:225:0:0 top-$1
ffmpeg -i $1 -vf crop=316:58:0:224 skill1-$1
ffmpeg -i $1 -vf crop=316:58:0:282 skill2-$1
ffmpeg -i $1 -vf crop=316:103:0:340 skill3-$1
