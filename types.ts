
export interface AdviceEntry {
  id: string;
  timestamp: number;
  creatureType: string;
  senderName: string;
  question: string;
  advice: string;
}

export enum CreatureType {
  Vampire = 'Vampire',
  Ghost = 'Ghost',
  Werewolf = 'Werewolf',
  Zombie = 'Zombie',
  Succubus = 'Succubus/Incubus',
  Cryptid = 'Cryptid',
  Mortal = 'Brave Mortal',
  Other = 'Other Dimension'
}
