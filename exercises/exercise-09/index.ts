import chalk from 'chalk';

/*

Intro:

    We have asynchronous functions now, advanced technology.
    This makes us a tech startup officially now.
    But one of the consultants spoiled our dreams about
    inevitable future IT leadership.
    He said that callback-based asynchronicity is not
    popular anymore and everyone should use Promises.
    He promised that if we switch to Promises, this would
    bring promising results. Promises, promises, promises.

Higher difficulty exercise:

    We don't want to reimplement all the data-requesting
    functions. Let's decorate the old callback-based
    functions with the new Promise-compatible result.
    The final function should return a Promise which
    would resolve with the final data directly
    (i.e. users or admins) or would reject with an error.

    The function should be named promisify.

Run:

    npm run 9

    - OR -

    yarn -s 9

*/

interface User {
  type: 'user';
  name: string;
  age: number;
  occupation: string;
}

interface Admin {
  type: 'admin';
  name: string;
  age: number;
  role: string;
}

type Person = User | Admin;

const admins: Admin[] = [
  {
    type: 'admin', name: 'Jane Doe', age: 32, role: 'Administrator',
  },
  {
    type: 'admin', name: 'Bruce Willis', age: 64, role: 'World saver',
  },
];

const users: User[] = [
  {
    type: 'user', name: 'Max Mustermann', age: 25, occupation: 'Chimney sweep',
  },
  {
    type: 'user', name: 'Kate Müller', age: 23, occupation: 'Astronaut',
  },
];

type ApiResponse<T> = (
  {
    status: 'success';
    data: T;
  } |
  {
    status: 'error';
    error: T;
  }
  );

const oldApi = {
  requestAdmins(callback: (_response: ApiResponse<Admin[]>) => void) {
    callback({
      status: 'success',
      data: admins,
    });
  },
  requestUsers(callback: (_response: ApiResponse<User[]>) => void) {
    callback({
      status: 'success',
      data: users,
    });
  },
  requestCurrentServerTime(callback: (_response: ApiResponse<number>) => void) {
    callback({
      status: 'success',
      data: Date.now(),
    });
  },
  requestCoffeeMachineQueueLength(callback: (_response: ApiResponse<string>) => void) {
    callback({
      status: 'error',
      error: 'Numeric value has exceeded Number.MAX_SAFE_INTEGER.',
    });
  },
};

function promisify<T>(
  arg: (_callback: (_response: ApiResponse<T>) => void) => void,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const tempCallback = (response: ApiResponse<T>) => {
      if (response.status === 'error') {
        reject(response.error);
      } else {
        resolve(response.data);
      }
    };
    arg(tempCallback);
  });
}

const api = {
  requestAdmins: () => promisify<Admin[]>(oldApi.requestAdmins),
  requestUsers: () => promisify<User[]>(oldApi.requestUsers),
  requestCurrentServerTime: () => promisify<number>(oldApi.requestCurrentServerTime),
  requestCoffeeMachineQueueLength: () => promisify<string>(oldApi.requestCoffeeMachineQueueLength),
};

function logPerson(person: Person) {
  console.log(
    ` - ${chalk.green(person.name)}, ${person.age}, ${person.type === 'admin' ? person.role : person.occupation}`,
  );
}

async function startTheApp() {
  console.log(chalk.yellow('Admins:'));

  (await api.requestAdmins()).forEach(logPerson);
  console.log();

  console.log(chalk.yellow('Users:'));
  (await api.requestUsers()).forEach(logPerson);
  console.log();

  console.log(chalk.yellow('Server time:'));
  console.log(`   ${new Date(await api.requestCurrentServerTime()).toLocaleString()}`);
  console.log();

  console.log(chalk.yellow('Coffee machine queue length:'));
  console.log(`   ${await api.requestCoffeeMachineQueueLength()}`);
}

startTheApp().then(
  () => {
    console.log('Success!');
  },
  (e: Error) => {
    console.log(`Error: "${e}", but it's fine, sometimes errors are inevitable.`);
  },
);

// In case if you are stuck:
// https://www.typescriptlang.org/docs/handbook/generics.html
