import { Command } from 'commander';
import * as prompts from '@clack/prompts';
import { happy, sad, congrats, thanks } from './lib/kaomoji';

const categories = { happy, sad, congrats, thanks } as const;
type CategoryName = keyof typeof categories;
const categoryNames = Object.keys(categories) as CategoryName[];

async function runInteractive(): Promise<void> {
  prompts.intro('kaomoji ＼(^o^)／');

  const category = await prompts.select({
    message: 'Pick a category',
    options: categoryNames.map((name) => ({
      value: name,
      label: name,
    })),
  });

  if (prompts.isCancel(category)) {
    prompts.cancel('Bye!');
    process.exit(0);
  }

  const result = categories[category as CategoryName]();
  prompts.outro(result);
}

const program = new Command();

program
  .name('kaomoji')
  .description('Random kaomoji generator ＼(^o^)／')
  .version('0.0.1')
  .argument('[category]', `Category: ${categoryNames.join(', ')}`)
  .option('-a, --all', 'Print all kaomojis in the category')
  .action(async (category?: string, options?: { all?: boolean }) => {
    if (!category) {
      await runInteractive();
      return;
    }

    if (!categoryNames.includes(category as CategoryName)) {
      console.error(
        `Unknown category: "${category}". Available: ${categoryNames.join(', ')}`,
      );
      process.exit(1);
    }

    const fn = categories[category as CategoryName];

    if (options?.all) {
      fn.all.forEach((k) => console.log(k));
    } else {
      console.log(fn());
    }
  });

program.parse();
