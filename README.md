# Svenska Elsparkcyklar AB – Systemuppsättning

Detta projekt innehåller ett fullständigt uthyrningssystem för elsparkcyklar i svenska städer. Här beskrivs hur du kommer igång med systemet lokalt.

---

## 1. Klona repot

Börja med att klona projektet:

```bash
git clone https://github.com/sakg23/vteam07.git
cd vteam07

# I projektroten
npm install

# I simulatorn
cd simulation
npm install

# I kundgränssnittet
cd ../customer-side
npm install

# I adminpanelen
cd ../admin
npm install

cp .env.example .env

docker-compose -f docker-compose.dev.yml up --build

cd simulation
node startSimulation.js
