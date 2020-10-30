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
  {type: 'admin', name: 'Jane Doe', age: 32, role: 'Administrator'},
  {type: 'admin', name: 'Bruce Willis', age: 64, role: 'World saver'}
];

const users: User[] = [
  {type: 'user', name: 'Max Mustermann', age: 25, occupation: 'Chimney sweep'},
  {type: 'user', name: 'Kate Müller', age: 23, occupation: 'Astronaut'}
];

type ApiResponse<T> = (
  {
    status: 'success';
    data: T;
  } |
  {
    status: 'error';
    error: string;
  }
  );

const oldApi = {
  requestAdmins(callback: (response: ApiResponse<Admin[]>) => void) {
    callback({
      status: 'success',
      data: admins
    });
  },
  requestUsers(callback: (response: ApiResponse<User[]>) => void) {
    callback({
      status: 'success',
      data: users
    });
  },
  requestCurrentServerTime(callback: (response: ApiResponse<number>) => void) {
    callback({
      status: 'success',
      data: Date.now()
    });
  },
  requestCoffeeMachineQueueLength(callback: (response: ApiResponse<number>) => void) {
    callback({
      status: 'error',
      error: 'Numeric value has exceeded Number.MAX_SAFE_INTEGER.'
    });
  }
};

function promisify<T>(arg: (callback: (response: ApiResponse<T>) => void) => void): any {
  const tempCallback = (response: ApiResponse<T>) => {
    if (response.status === 'success') {
      return response.data;
    } else {
      return response.error;
    }
  }
  arg(tempCallback);
}

const api = {
  requestAdmins: () => promisify<Admin[]>(oldApi.requestAdmins),
  requestUsers: () => promisify<User[]>(oldApi.requestUsers),
  requestCurrentServerTime: () => promisify<number>(oldApi.requestCurrentServerTime),
  requestCoffeeMachineQueueLength: () => promisify<number>(oldApi.requestCoffeeMachineQueueLength)
};

function logPerson(person: Person) {
  console.log(
    ` - ${chalk.green(person.name)}, ${person.age}, ${person.type === 'admin' ? person.role : person.occupation}`
  );
}

async function startTheApp() {
  console.log('Pasó 0');
  console.log(api.requestAdmins(), 'Siiii siiii 1');
  console.log(api.requestAdmins, 'Siiii siiii 2');
  console.log(chalk.yellow('Admins:'));


  (await api.requestAdmins()).forEach(logPerson);
  console.log();

  console.log('Pasó 1');

  console.log(chalk.yellow('Users:'));
  (await api.requestUsers()).forEach(logPerson);
  console.log();

  console.log('Pasó 2');

  console.log(chalk.yellow('Server time:'));
  console.log(`   ${new Date(await api.requestCurrentServerTime()).toLocaleString()}`);
  console.log();

  console.log('Pasó 3');

  console.log(chalk.yellow('Coffee machine queue length:'));
  console.log(`   ${await api.requestCoffeeMachineQueueLength()}`);

  console.log('Pasó 4');
}

startTheApp().then(
  () => {
    console.log('Success!');
  },
  (e: Error) => {
    console.log(`Error: "${e.message}", but it's fine, sometimes errors are inevitable.`);
  }
);

// In case if you are stuck:
// https://www.typescriptlang.org/docs/handbook/generics.html
