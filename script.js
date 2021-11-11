let user;

login();

function keepConexion() {
    axios.post('https://mock-api.driven.com.br/api/v4/uol/status', user)
}

function login() {
    user = {
        name: prompt('Qual seu nome?')
    }

    const promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants', user);

    promise
        .then(() => {
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

/*
<article class="status">
            <time>(09:21:45)</time>  <strong>João</strong>  <span>entra na sala...</span>
        </article>

        <article class="message">
            <time>(09:21:45)</time> <strong>João</strong> <span>para</span> <strong>Todos</strong>: <span>Bom dia</span>
        </article>

        <article class="message">
            <time>(09:21:45)</time> <strong>Maria</strong> <span>para</span> <strong>João</strong>: <span>Oi João :)</span>
        </article>

        <article class="private_message">
            <time>(09:21:45)</time> <strong>João</strong> <span>reservadamente para</span> <strong>Maria</strong>: <span>oi gatinha quer tc?</span>
        </article>

        <article class="status">
            <time>(09:21:45)</time>  <strong>Maria</strong>  <span>sai da sala...</span>
        </article>
*/