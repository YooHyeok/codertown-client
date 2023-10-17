import { makeObservable, observable, action } from 'mobx'; // npm install mobx mobx-react


const createStompClientStore = () => {
  const stompClientStore = {
    stompClient: null,

    setStompClient(client) {
      this.stompClient = client;
    },

    getStompClient() {
      return this.stompClient;
    },
  };

  return makeObservable(stompClientStore, {
    stompClient: observable,
    setStompClient: action,
    getStompClient: action,
  });
};

const stompClientStore = createStompClientStore();

export default stompClientStore;