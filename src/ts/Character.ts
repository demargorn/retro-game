class Character {
   static types: string[] = [
      "bowman",
      "swordsman",
      "magician",
      "undead",
      "vampire",
      "daemon",
   ];

   health: number;
   attack: number;
   defence: number;
   isEnemy: boolean;
   distance: number;
   distanceAttack: number;

   constructor(public level: number, public type: string = "generic") {
      this.health = 50;
      this.attack = 0;
      this.defence = 0;

      if (!Character.types.includes(type)) {
         throw new Error("invalid character type");
      }

      if (new.target.name === "Character") {
         throw new Error("You cannot create an object of the Character class");
      }
   }

   levelUp() {
      this.level += 1;
      this.attack = Math.max(
         this.attack,
         Math.round(this.attack * (1.8 - this.health / 100))
      );
      this.defence = Math.max(
         this.defence,
         Math.round(this.defence * (1.8 - this.health / 100))
      );
      this.health = this.health + 80 > 100 ? 100 : this.health + 80;
   }
}

export { Character };
