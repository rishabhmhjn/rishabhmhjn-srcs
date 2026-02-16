import { sample } from './utils';
import {
  happy as happyAll,
  sad as sadAll,
  congrats as congratsAll,
  thanks as thanksAll,
} from './collections';

type KaomojiFunction = (() => string) & { all: string[] };

function createCategory(items: string[]): KaomojiFunction {
  const fn = () => sample(items);
  fn.all = items;
  return fn as KaomojiFunction;
}

export const happy = createCategory(happyAll);
export const sad = createCategory(sadAll);
export const congrats = createCategory(congratsAll);
export const thanks = createCategory(thanksAll);
