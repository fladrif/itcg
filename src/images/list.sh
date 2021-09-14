#!/bin/bash

cards=("Drake.jpg" "GreenTrixter.jpg" "JrBoogie.jpg" "LunarPixie.jpg" "Stirge.jpg" "Tweeter.jpg" "ArrowBlow.jpg" "RainOfArrows.jpg" "SoulArrow.jpg" "PowerKnockBack.jpg" "GoldenCrow.jpg") 

for i in "${cards[@]}"
do
  ./cropNonChar.sh $i
done
