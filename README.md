# Assignment

- Il work plan con il Kanban sfruttato durante il lavoro lo si puo trovare a questo [link](https://presdario.notion.site/exercise-68627171e1a740e582465ec9da2a910e)

- A questo [link](https://www.postman.com/presdev/workspace/assignment/overview) si puo visualizzare la collection postman

- Per rendere piu completo l'esercizio, ho pensato di predisporre un ambiente di test con docker e postman. Per installare l'environment di test è necessario:
    - installare docker e docker-compose
    - aver installato postman o postman-agent
    
## Avviare l''ambiente di test

- Clona il progetto
```
$ git clone https://github.com/DevPres/node-exercise.git
```

- Entra nel progetto e dai npm i

```
$ cd node-exercise
$ npm i
```

- copia il file .env.axample nel file .env

- Crea un jwt token, volendo puoi sfruttare questo comando:

```
//da terminale dai il comando node per aprire la shell di node
$ node

$ require('crypto).randomBytes(64)
```

- Copia l'otput nel file .env nell'ACCESS_TOKEN_SECRET, poi dai nuovamente il comando e copia il nuovo output nel file .env nel REFRESH_TOKEN_SECRET

- dai il comando docker-compose up
```
$ docker-compose up (docker compose up su ARCH)
```

- connettiti a questo [link](https://www.postman.com/presdev/workspace/assignment/overview) per visualizzare la collection di API su postman

- Se si ha installato postman desktop o il postman agent si puo passare al test (altrimenti le chiamate su localhost non possono partire)


## NOTE SULL'ESERCIZIO

Tecnologie usate:
Node.js
Express.js
PostgreSQL

### Autenticazione
Anche se non richiesta esplicitamente dall'esercizio, ho deciso di realizzare un banale servizio jwt per login e registrazione, cosi da poter legare dopo la sessione del carrello alla sessione dell'utente.

Il flusso di autorizzazione/autenticazione funziona cosi:
- L'utente deve registrarsi
- Effetuato il login, l'applicativo prima segna un access_token ed un refresh_token, poi setta nei cookie il refresh_token, segna nel db all'utente il refresh_token e restituisce come body l'access_token (per questioni di sviluppo ho messo l'expire a 5 min ma in una situazione ideale dovrebbe durare sotto i 30s)
- Quando scade l'access token si puo effetuare una chiamata per refreshare l'access_token
- Al Logout vengono puliti i cookie ed il db
- Alcune rotte sono protette dal middleware verifyJWT che risponde unhautorized se il token non è valido

### Acquisto prodotti
Prima una piccola nota su come ho disegnato il db. Il carrello dipende da due tabelle, la prima cart_session, dove sono salvati tutti i carrelli attivi (uno per ogni utente), la seconda è cart_product dove ho salvato le relazioni tra il carrello in sessione e la tabella dei prodotti. inoltre nella tabella cart_product èè presente il prezzo effettivo al netto degli sconti (totali per la quantitàa di elementi)

Per quanto riguarda il flusso di acquisto dei prodotti e l''applicazione degli sconti ho scelto di ragionare cosi
- Viene chiamato l'endpoint di aggiunta elemento al carrello, con l'id del prodotto nei params (tabella products)
- Se non c'è un carrello in sessione, lo creo, altrimenti lo aggiorno
- Aggiungo + 1 alla quantitàa di prodotto
- Resetto i prezzi togliendo la scontistica (per essere sicuro di non applicare lo sconto a degli elementi gia scontati)
- Calcolo se ci sono delle scontistiche da applicare, e in caso positivo le applico
- ricalcolo il totale del carrello al netto della scontistica
- ritorno il carrello

Per quanto riguarda l'eliminazione dal carrello ho deciso di ragionare cosi:
- Viene chiamato l'endpoint di eliminazione dal carrello con l''id dellelelmnto del carrello da diminuire (tabella cart_product)
- Tolgo - 1 alla quantità di prodotto
- Se il carrello è vuoto distruggo la sessione e ritorno 

Altrimenti
- Resetto i prezzi togliendo la scontistica (per essere sicuro di non applicare lo sconto a degli elementi gia scontati)
- Calcolo se ci sono delle scontistiche da applicare, e in caso positivo le applico
- ricalcolo il totale del carrello al netto della scontistica
- ritorno il carrello

### cose lasciate fuori
Purtroppo non sono riuscito a completare l'esercizio come avrei voluto, ad esempio non sono stati implemntati i test, e non sono riuscito a creare la parte successiva alla vendita del prodotto, come una tabella dove salvare le transazioni eseguite, cose le quali erano nel mio progetto (quindi per ora l'applicativo si ferma nel permettere la composizione del carrello e l'applicazione della scontisctica).
Purtroppo non sono riouscito a lavorare il weekend quindi quei tre giorni in piu mi avrebbero dato la possibilitàa di completarlo, ma mi ritengo comunque soddisfatto poichè è il primo web service complesso che scrivo con node.js ed è la prima volta che uso postgresSQL al di fuori di supabase.
