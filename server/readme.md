# Timetracking app CRUD API server

Server je napravljen na Node.js - Express modulu, sa podrskom za MongoDB baze, CORS razmenu podataka i JWT Tokene za sigurnost.

Za pokretanje servera:
```sh
npm start
```
ili za development - sa vise logova i statistike:
```sh
npm run dev
```

## Konfiguracija
Server se konfigurise uz pomoc __*dotenv*__ modula i konfiguracijskih fajlova u __*config*__ folderu.

Konfiguracijski parametri su:  
   PORT - na kome ce server slusati za zahteve.  
   DB_URI - Puna adresa za konekciju sa Mongo Bazom Podataka.  
   ALLOWED_IPS - Lista IP adresa za koje je dozvoljen CORS zahtev serveru.  
   BCRYPT_SALT - Kompleksnost enkripcije korisnicke sifre prilikom registracije korisnika.(veci broj - sporije - veca zastita).  
   SECRET - Super tajna sifra za generisanje tokena.  
   REFRESH_SECRET = Super tajna sifra za generisanje refresh tokena.  
   TOKEN_LIFE - Vreme za validnost tokena  
   REFRESH_TOKEN_LIFE - Vreme za validnost refresh tokena

## RUTE

### Osnovna ruta:
**http://........./api/v1/** (GET)
- prihvata **GET** bez patametara
- vraca 200 (OK) sa osnovnom pozdravnom porukom kao JSON

### Korisnicke rute:

#### Javne:
**http://........./api/v1/users/sign-in** (POST)
- prihvata **POST**  
  zahteva JSON uz body sa:
  ```json
  {
    email,
    password,
  }
  ```

- Ako je sve u redu, vraca 202 (Accepted) sa JSON uz body:
  ```json
  {
    success: true,
    message: 'Korisnik je uspesno prijavljen',
    data: {
      token,
      refreshToken,
      user: {
        fullName,
        email,
        id,
      },
    },
  }
  ```
- Ako je doslo do greske, vraca 422 (Unprocessable Entity) ili 500 (Internal Server Error) i JSON uz body:
  ```json
  {
    success: false,
    message: 'Neuspešno prijavljivanje!',
    error: <Prosledjena greska servera>,
  }
  ```

**http://........./api/v1/users/sign-up** (POST)
- prihvata **POST**  
  zahteva JSON uz body sa:
  ```json
  {
    fullName,
    email,
    password,
    isAdmin,
  }
  ```
- Ako je sve u redu, vraca 201 (Created) sa JSON uz body:
  ```json
  {
    success: true,
    message: 'Korisnik je uspesno kreiran!',
    data: {
      user: {
        fullName,
        email,
        id,
      },
    },
  }
  ```
- Ako je doslo do greske, vraca 400 (Bad Request), 422 (Unprocessable Entity) ili 500 (Internal Server Error) i JSON uz body:
  ```json
  {
    success: false,
    message: 'Neuspešno prijavljivanje!',
    error: <Prosledjena greska servera>,
  }
  ```

#### Zasticene
**http://........./api/v1/users/sign-out** (POST)
- prihvata **POST**  
  zahteva **TOKEN** uz **body, query, header 'x-access-token' ili header authorization Bearer**
- Ako je sve u redu, vraca 200 (OK) sa JSON uz body:
  ```json
  {
    success: true,
    message: 'Korisnik je odjavljen.',
  }
  ```
- Ako je doslo do greske, vraca 500 i JSON uz body:
  ```json
  {
    success: false,
    message: 'Neuspešno prijavljivanje!',
    error: <Prosledjena greska servera>,
  }
  ```
  ili, ako token nije prosledjen ili nije validan, vraca 401 (Unauthorized) i JSON uz body:
  ```json
  {
    success: false,
    message: 'Nije prosledjen validan JWToken.' ili 'Neautorizovan pristup',
    error: <Prosledjena greska servera>,
  }
  ```

**http://........./api/v1/users/all** (GET)
- prihvata **GET**  
  zahteva **TOKEN** uz **body, query, header 'x-access-token' ili header authorization Bearer**
- Ako je sve u redu, vraca 200 (OK) sa JSON uz body:
  ```json
  {
    sucess: true,
    message: 'Pretraga je uspela',
    data: {
      token: newToken,
      users,
    },
  }
  ```
- Ako je doslo do greske, vraca 400 (Bad Request) ili 500 (Internal Server Error) i JSON uz body:
  ```json
  {
    success: false,
    message: 'Neuspešno prijavljivanje!',
    error: <Prosledjena greska servera>,
  }
  ```

**http://........./api/v1/users/id** (GET, PUT, DELETE)
- prihvata **GET**
  zahteva **TOKEN** uz **body, query, header 'x-access-token' ili header authorization Bearer**
- Ako je sve u redu, vraca 200 (OK) sa JSON uz body:
  ```json
  {
    sucess: true,
    message: 'Pretraga je uspela',
    data: {
      token: newToken,
      user,
    },
  }
  ```
- Ako je doslo do greske, vraca 400 (Bad Request) ili 500 (Internal Server Error) i JSON uz body:
  ```json
  {
    success: false,
    message: 'Neuspešno prijavljivanje!',
    error: <Prosledjena greska servera>,
  }
  ```
- prihvata **PUT**  
  zahteva **TOKEN** uz **body, query, header 'x-access-token' ili header authorization Bearer** i JSON koji sadrzi jedan ili vise parametara koji se manjaju:
  ```json
  {
    fullName,
    email,
    password,
    isAdmin,
  }
  ```
- Ako je sve u redu, vraca 200 (OK) sa JSON uz body:
  ```json
  {
    sucess: true,
    message: 'Promene podataka za datog korisnika su sačuvane.',
    data: {
      token: newToken,
      user,
    },
  }
  ```
- Ako je doslo do greske, vraca 400 (Bad Request), 422 (Unprocessable Entity) ili 500 (Internal Server Error) i JSON uz body:
  ```json
  {
    success: false,
    message: 'Neuspešno prijavljivanje!',
    error: <Prosledjena greska servera>,
  }
  ```
- prihvata **DELETE**  
  zahteva **TOKEN** uz **body, query, header 'x-access-token' ili header authorization Bearer**
- Ako je sve u redu, vraca 200 (OK) sa JSON uz body:
  ```json
  {
    sucess: true,
    message: 'Korisnik ${user} je obrisan!',
  }
  ```
- Ako je doslo do greske, vraca 400 (Bad Request) ili 500 (Internal Server Error) i JSON uz body:
  ```json
  {
    success: false,
    message: 'Neuspešno prijavljivanje!',
    error: <Prosledjena greska servera>,
  }
  ```

### Vremenske rute:
**http://........./api/v1/timers** (POST, GET)
- prihvata **POST**  
  zahteva **TOKEN** uz **body, query, header 'x-access-token' ili header authorization Bearer** i JSON sa tajmerom:
  ```json
  {
    userId,
    startTime,
  }
  ```
- Ako je sve u redu, vraca 201 (Created) sa JSON uz body:
  ```json
  {
    sucess: true,
    message: 'Tajmer kreiran!',
    data: {
      timer_obj,
    }
  }
  ```
- Ako je doslo do greske, vraca 500 (Internal Server Error) i JSON uz body:
  ```json
  {
    success: false,
    message: 'Greska prilikom obrade podataka!',
    error: <Prosledjena greska servera>,
  }
  ```
- prihvata **GET**  
  zahteva **TOKEN** uz **body, query, header 'x-access-token' ili header authorization Bearer** 
- Ako je sve u redu, vraca 200 (OK) sa JSON uz body:
  ```json
  {
    sucess: true,
    message: 'Lista tajmera za trazenog korisnika.',
    data: {
      timers_obj,
    }
  }
  ```
- Ako je doslo do greske, vraca 400 (Bad Request) i JSON uz body:
  ```json
  {
    success: false,
    message: 'Greska prilikom obrade podataka!',
    error: <Prosledjena greska servera>,
  }
  ```
**http://........./api/v1/timers/id**  (GET, PUT, DELETE)
- prihvata **GET**  
  zahteva **TOKEN** uz **body, query, header 'x-access-token' ili header authorization Bearer** 
- Ako je sve u redu, vraca 200 (OK) sa JSON uz body:
  ```json
  {
    sucess: true,
    message: 'Tajmer je pronadjen',
    data: {
      time_obj,
    }
  }
  ```
- Ako je doslo do greske, vraca 400 (Bad Request) i JSON uz body:
  ```json
  {
    success: false,
    message: 'Greska prilikom obrade podataka!',
    error: <Prosledjena greska servera>,
  }
  ```
  - prihvata **PUT**  
  zahteva **TOKEN** uz **body, query, header 'x-access-token' ili header authorization Bearer** i JSON sa timerom:
  ```json
  {
    endTime,
  }
  ```
- Ako je sve u redu, vraca 201 (Created) sa JSON uz body:
  ```json
  {
    sucess: true,
    message: 'Promene su sacuvane.',
    data: {
      time_obj,
    }
  }
  ```
- Ako je doslo do greske, vraca 400 (Bad Request), ili 500 (Internal Server Error) i JSON uz body:
  ```json
  {
    success: false,
    message: 'Greska prilikom obrade podataka!',
    error: <Prosledjena greska servera>,
  }
  ```
  - prihvata **DELETE**  
  zahteva **TOKEN** uz **body, query, header 'x-access-token' ili header authorization Bearer** 
- Ako je sve u redu, vraca 200 (OK) sa JSON uz body:
  ```json
  {
    sucess: true,
    message: 'Tajmer je obrisan',
    data: {
      time_obj,
    }
  }
  ```
- Ako je doslo do greske, vraca 400 (Bad Request) i JSON uz body:
  ```json
  {
    success: false,
    message: 'Greska prilikom obrade podataka!',
    error: <Prosledjena greska servera>,
  }
  ```