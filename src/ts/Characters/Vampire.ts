import { Character } from "../Character";

class Vampire extends Character {
   health: number;
   attack: number;
   defence: number;
   distance: number;
   distanceAttack: number;
   isEnemy: boolean;

   constructor(public level: number = 1) {
      super(1, "vampire");
      this.attack = 50;
      this.defence = 50;
      this.health = 100;
      this.distance = 2;
      this.distanceAttack = 2;
      this.isEnemy = true;
   }
}
export { Vampire };
