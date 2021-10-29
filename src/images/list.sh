#!/bin/bash

cards=("Avenger.jpg" "DoubleStrike.jpg" "Buffy.jpg" "Cico.jpg" "Croco.jpg" "Krappy.jpg" "Krip.jpg" "Lorang.jpg" "CurseEye.jpg" "HornedMushroom.jpg" "PlatoonChronos.jpg" "ItemTrade.jpg" "EnergyBolt.jpg" "Heal.jpg" "SideQuest.jpg" "BellflowerRoot.jpg" "Lioner.jpg" "PeachMonkey.jpg" "ZetaGray.jpg" "ZombieLupin.jpg" "CoconutKnife.jpg" "JrYeti.jpg" "Pepe.jpg" "Sentinel.jpg") 

for i in "${cards[@]}"
do
  ./cropNonChar.sh $i
done

charcards=("Ivan.jpg" "Maya.jpg") 

for j in "${charcards[@]}"
do
  ./cropChar.sh $j
done

