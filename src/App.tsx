import React from 'react';
import logo from './logo.svg';
import './App.css';
import { AceBase, ID } from 'acebase';

class User {
  public id = "";
  public name = "";
  public pets?: {
    [key: string]: Pet;
  }
}

class Pet {
  public id = "";
  public name = "";
  public awards?: {
    [key: string]: Award;
  }
}

class Award {
  public id = "";
  public name = "";
}

async function seedDatabase(db: AceBase) {
  const award = new Award()
  award.id = ID.generate();
  award.name = "Some Award";

  const pet = new Pet();
  pet.id = ID.generate();
  pet.name = "Some Pet";
  pet.awards = {
    [award.id]: award
  };

  const user = new User();
  user.name = "Some User";
  user.pets = {
    [pet.id]: pet
  };

  const userRef = await db.ref("users").push(user);
}

function mapToClass(db: AceBase) {
  db.types.bind("users", User, {
    creator: snap => {
      const key = snap.ref.key;
      const obj = snap.val();

      const user = new User();
      user.id = key;
      user.name = obj.name;
      user.pets = obj.pets;

      return user;
    },
    serializer: (ref, obj) => {
      return {
        name: obj.name
      };
    }
  });

  db.types.bind("users/*/pets", Pet, {
    creator: snap => {
      const key = snap.ref.key;
      const obj = snap.val();

      const pet = new Pet();
      pet.id = key;
      pet.name = obj.name;
      pet.awards = obj.awards;

      return pet;
    },
    serializer: (ref, obj) => {
      return {
        name: obj.name
      };
    }
  });

  db.types.bind("users/*/pets/*/awards", Award, {
    creator: snap => {
      const key = snap.ref.key;
      const obj = snap.val();

      const award = new Award();
      award.id = key;
      award.name = obj.name;

      return award;
    },
    serializer: (ref, obj) => {
      return {
        name: obj.name
      };
    }
  });
}

// Component

type AppProps = {

}

type AppState = {

}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {

    };
  }

  async componentDidMount(): Promise<void> {
    const db = AceBase.WithIndexedDB("test-db");
    mapToClass(db);
    seedDatabase(db);
  }

  render(): JSX.Element {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
