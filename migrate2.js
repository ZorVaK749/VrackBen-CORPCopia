const fs = require('fs');
const path = require('path');

const services = [
  'bff',
  'ms-auth-server',
  'ms-catalog',
  'ms-shopping-cart',
  'ms-stock',
  'Backend/eureka-server',
  'Backend/supplier-procurement',
  'Backend/job-orders',
  'Backend/appointment-scheduler',
  'Backend/vehicle-history',
  'Backend/order-management'
];

services.forEach(svc => {
  const ymlPath = path.join(__dirname, svc, 'src/main/resources/application.yml');
  if (fs.existsSync(ymlPath)) {
    let ymlContent = fs.readFileSync(ymlPath, 'utf8');
    let changed = false;

    // Eureka localhost fix (BFF)
    if (ymlContent.includes('localhost:8761/eureka')) {
      ymlContent = ymlContent.replace(/http:\/\/localhost:8761\/eureka\/?/g, 'http://${EUREKA_HOST:eureka.vrakben.local}:8761/eureka/');
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(ymlPath, ymlContent);
      console.log(`Updated YML for ${svc}`);
    }
  }

  const propPath = path.join(__dirname, svc, 'src/main/resources/application.properties');
  if (fs.existsSync(propPath)) {
    let propContent = fs.readFileSync(propPath, 'utf8');
    let changed = false;

    // PostgreSQL
    if (propContent.includes('jdbc:postgresql://vrakben-db')) {
      propContent = propContent.replace(/jdbc:postgresql:\/\/vrakben-db:5432\/vrakben_db/g, 'jdbc:postgresql://${DB_HOST:infra.vrakben.local}:5432/vrakben_db');
      changed = true;
    }
    // Eureka
    if (propContent.includes('eureka-server:8761') || propContent.includes('localhost:8761')) {
      propContent = propContent.replace(/http:\/\/(eureka-server|localhost):8761\/eureka\/?/g, 'http://${EUREKA_HOST:eureka.vrakben.local}:8761/eureka/');
      changed = true;
    }

    // Actuator
    if (!propContent.includes('management.endpoints.web.exposure.include')) {
      propContent += `\nmanagement.endpoints.web.exposure.include=health,info\n`;
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(propPath, propContent);
      console.log(`Updated PROPERTIES for ${svc}`);
    }
  }
});
console.log("Migration 2 script finished.");
