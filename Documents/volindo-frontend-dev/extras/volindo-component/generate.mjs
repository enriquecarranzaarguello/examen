import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';

async function generateComponent() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'componentName',
      message: 'What is the name of your component?',
      validate: input => {
        if (input === '') {
          return 'Component name cannot be empty';
        }
        if (input[0] !== input[0].toUpperCase()) {
          return 'Component name should start with an uppercase letter';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'subfolder',
      message:
        'Enter the subfolder path for the component (leave empty for no subfolder):',
    },
  ]);

  const { componentName, subfolder } = answers;
  const folderName =
    componentName.charAt(0).toLowerCase() + componentName.slice(1);
  const baseDir = path.join(process.cwd(), 'src', 'components');
  const fullSubfolderPath = subfolder ? path.join(baseDir, subfolder) : baseDir;

  fs.ensureDirSync(fullSubfolderPath);

  const componentDir = path.join(fullSubfolderPath, folderName);

  if (fs.existsSync(componentDir)) {
    console.error(`Component ${componentName} already exists.`);
    return;
  }

  fs.ensureDirSync(componentDir);

  const componentContent = `import React from 'react';
import styles from './${componentName}.module.scss';

const ${componentName} = () => {
    return <div className={styles.${componentName.toLowerCase()}}>Hello, ${componentName}!</div>;
};

export default ${componentName};
`;

  const indexContent = `export { default } from './${componentName}';`;

  const sassContent = `.${componentName.toLowerCase()} {
    // Your styles here
}
`;

  const storybookContent = `import type { Meta, StoryObj } from '@storybook/react';

import ${componentName} from './${componentName}';

const meta: Meta<typeof ${componentName}> = {
  component: ${componentName},
};

export default meta;
type Story = StoryObj<typeof ${componentName}>;

export const Primary: Story = {};
`;

  fs.writeFileSync(
    path.join(componentDir, `${componentName}.tsx`),
    componentContent
  );
  fs.writeFileSync(
    path.join(componentDir, `${componentName}.module.scss`),
    sassContent
  );
  fs.writeFileSync(
    path.join(componentDir, `${componentName}.stories.tsx`),
    storybookContent
  );
  fs.writeFileSync(path.join(componentDir, 'index.ts'), indexContent);

  console.log(
    `Component ${componentName} created successfully in ${componentDir}`
  );
}

generateComponent().catch(err => console.error(err));
