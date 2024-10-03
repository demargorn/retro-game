import { Character } from "../Character";

class Magician extends Character {
   health: number;
   attack: number;
   defence: number;
   distance: number;
   distanceAttack: number;
   isEnemy: boolean;

   constructor(public level: number = 1) {
      super(1, "magician");
      this.attack = 20;
      this.defence = 60;
      this.health = 100;
      this.distance = 1;
      this.distanceAttack = 4;
      this.isEnemy = false;
   }
}
export { Magician };
