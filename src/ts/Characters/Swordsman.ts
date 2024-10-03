import { Character } from "../Character";

class Swordsman extends Character {
   health: number;
   attack: number;
   defence: number;
   distance: number;
   distanceAttack: number;
   isEnemy: boolean;

   constructor(public level: number = 1) {
      super(1, "swordsman");
      this.attack = 60;
      this.defence = 20;
      this.health = 100;
      this.distance = 3;
      this.distanceAttack = 1;
      this.isEnemy = false;
   }
}

export { Swordsman };
