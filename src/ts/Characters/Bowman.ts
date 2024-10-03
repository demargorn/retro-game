import { Character } from "../Character";

class Bowman extends Character {
   health: number;
   attack: number;
   defence: number;
   distance: number;
   distanceAttack: number;
   isEnemy: boolean;

   constructor(public level: number = 1) {
      super(1, "bowman");
      this.health = 100;
      this.attack = 50;
      this.defence = 50;
      this.distance = 2;
      this.distanceAttack = 4;
      this.isEnemy = false;
   }
}
export { Bowman };
