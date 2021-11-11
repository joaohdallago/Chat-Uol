let user;

login();

function errorCase() {
    alert('Ocorreu um erro! Por favor, faça novamente o login');
    window.location.reload();
}

function keepConexion() {
    const promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/status', user);

    promise.catch(errorCase)
}

function login() {
    user = {
        name: prompt('Qual seu nome?')
    }

    const promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants', user);

    promise
        .then(() => {
            keepConexion();
            setInterval(keepConexion, 5000);
            getMessages();
            setInterval(getMessages, 3000);
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
                message.from === user.from ||
                message.from === user.to
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

const sendMessageInput = document.querySelector('footer input')

sendMessageInput.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      document.querySelector('footer ion-icon').click();
    }
  });

function sendMessage() {
    if (sendMessageInput.value === '') {
        return
    }

    const messageToSend = {
        from: user.name,
        to: "Todos",
        text: sendMessageInput.value,
        type: "message"
    }

    const promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/messages', messageToSend);

    promise
        .then(getMessages)

        .catch(errorCase)

    document.querySelector('footer input').value = '';
}

function openMenu() {
    const menu = document.querySelector('aside');

    menu.classList.add('open');
}