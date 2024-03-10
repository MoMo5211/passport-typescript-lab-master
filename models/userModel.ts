interface GithubProfileInfo {
  id: string;
  displayName: string;
  username: string;
  profileUrl: string;
  emails: [{ value: string }];
  photos: [{ value: string }];
}


interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  githubId?: string;
  role: 'user' | 'admin';
}

const database: User[] = [
  {
    id: 1,
    name: "Jimmy Smith",
    email: "jimmy123@gmail.com",
    password: "jimmy123!",
    role:"admin"
  },
  {
    id: 2,
    name: "Johnny Doe",
    email: "johnny123@gmail.com",
    password: "johnny123!",
    role:"user"
  },
  {
    id: 3,
    name: "Jonathan Chen",
    email: "jonathan123@gmail.com",
    password: "jonathan123!",
    role:"user"
  },
];

let nextId = database.length; 

const userModel = {
  findOne: (email: string): User | null => {
    const user = database.find((user) => user.email === email);
    return user || null;
  },

  findById: (id: number): User | undefined => {
    const user = database.find((user) => user.id === id);
    if (user) {
      return user;
    }
    throw new Error(`Couldn't find user with id: ${id}`);
  },

  findOrCreateUserByGithubId: (githubId: string, profile: any): User => {
    let user = database.find((user) => user.githubId === githubId);
    if (!user) {
      nextId++;
      user = {
        id:nextId,
        name: profile.displayName || profile.username, 
        email: profile.emails && profile.emails[0].value, 
        password: '', 
        githubId: githubId,
        role: 'user' 
      };
      database.push(user);
      return user;
    }
    return user;
  }
  
};

export { database, userModel, User };

