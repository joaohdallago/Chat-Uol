let user;

const sendMessageInput = document.querySelector('footer input')

sendMessageInput.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      document.querySelector('footer ion-icon').click();
    }
  });

let messageToSend = {
    from: "",
    to: "Todos",
    text: "",
    type: "message"
}



function errorCase() {
    alert('Ocorreu um erro! Por favor, faça novamente o login');
    window.location.reload();
}

function keepConexion() {
    const promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/status', user);

    promise.catch(errorCase)
}

function login() {
    const usernameInput = document.querySelector('.username');

    const loginScreen = document.querySelector('.login-screen');
    loginScreen.classList.add('display-none');

    messageToSend.from = usernameInput.value;

    user = {
        name: usernameInput.value
    }


    const promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants', user);

    promise
        .then(() => {
            keepConexion();
            setInterval(keepConexion, 5000);

            getMessages();
            setInterval(getMessages, 3000);

            getParticipants()
            setInterval(getParticipants, 10000);
        })

        .catch(() => {
            alert('Este nome já exite');
            login()
        })
};

function getMessages() {
    const messagesPromise = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages');

    messagesPromise.then(renderMessages)
}

function renderMessages(messages) {
    const mainElement = document.querySelector('main');

    mainElement.innerHTML = '';

    messages.data.forEach(message => {
        if (message.type === 'status') {
            mainElement.innerHTML += `
                <article class="status">
                    <time>${message.time}</time>  <strong>${message.from}</strong>  <span>${message.text}</span>
                </article>
            `
        }else if (message.type === 'message') {
            mainElement.innerHTML += `
                <article class="message">
                    <time>${message.time}</time> <strong>${message.from}</strong> <span>para</span> <strong>${message.to}</strong>: <span>${message.text}</span>
                </article>
            `
        } else if (
            message.type === 'private_message' && (
                message.from === user.name ||
                message.to === user.name
            )
        ) {
            mainElement.innerHTML += `
                <article class="private_message">
                    <time>${message.time}</time> <strong>${message.from}</strong> <span>reservadamente para</span> <strong>${message.to}</strong>: <span>${message.text}</span>
                </article>
            `
        }
    })

    mainElement.lastElementChild.scrollIntoView();
}



function sendMessage() {
    if (sendMessageInput.value === '') {
        return
    }

    messageToSend.text = sendMessageInput.value;

    const promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/messages', messageToSend);

    promise
        .then(getMessages)

        .catch(errorCase)

    document.querySelector('footer input').value = '';
};

function getParticipants() {
    const promise = axios.get('https://mock-api.driven.com.br/api/v4/uol/participants');
    const participantsUl = document.querySelector('.participants');

    promise.then(
        participants => {
            participantsUl.innerHTML = '';

            participants.data.forEach(
                participant => {
                    let isChoosed = '';

                    if (participant.name === messageToSend.to) {
                        isChoosed = 'choosed';
                    }

                    participantsUl.innerHTML += `
                        <li class="participant ${isChoosed}" onclick="chooseParticipant(this)">
                            <ion-icon name="checkmark" class="check"></ion-icon>

                            <ion-icon name="person-circle"></ion-icon>
                            <span>${participant.name}</span>
                        </li>
                    `
                }
            )
        }
    )
};


function toggleMenu() {
    const menu = document.querySelector('aside');

    menu.classList.toggle('open');
};

function chooseParticipant(participant) {
    const lastPaticipantChoosed = document.querySelector('.participant.choosed');

    if (lastPaticipantChoosed !== null) {
        lastPaticipantChoosed.classList.remove('choosed')
    }

    participant.classList.add('choosed');

    messageToSend.to = participant.lastElementChild.innerHTML;
}

function chooseVisibility(visibilityOption) {
    const lastVisibilityChoosed = document.querySelector('.visibility-option.choosed');

    if (lastVisibilityChoosed !== null) {
        lastVisibilityChoosed.classList.remove('choosed')
    }

    visibilityOption.classList.add('choosed')

    messageToSend.type = visibilityOption.id;
}


