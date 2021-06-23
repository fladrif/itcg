#!/bin/bash

cards=( "EmeraldEarrings.jpg" "Fairy.jpg" "GreenMushroom.jpg" "JrNecki.jpg" "MagicClaw.jpg" "Octopus.jpg" "OrangeMushroom.jpg" "RedSnail.jpg" "RibbonPig.jpg" "WildBoar.jpg") 

for i in "${cards[@]}"
do
  ./cropNonChar.sh $i
done
