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
  // Update POM
  const pomPath = path.join(__dirname, svc, 'pom.xml');
  if (fs.existsSync(pomPath)) {
    let pomContent = fs.readFileSync(pomPath, 'utf8');
    if (!pomContent.includes('spring-boot-starter-actuator')) {
      pomContent = pomContent.replace(
        '</dependencies>',
        `  <dependency>\n      <groupId>org.springframework.boot</groupId>\n      <artifactId>spring-boot-starter-actuator</artifactId>\n    </dependency>\n  </dependencies>`
      );
      fs.writeFileSync(pomPath, pomContent);
      console.log(`Updated POM for ${svc}`);
    }
  }

  // Update YML
  const ymlPath = path.join(__dirname, svc, 'src/main/resources/application.yml');
  if (fs.existsSync(ymlPath)) {
    let ymlContent = fs.readFileSync(ymlPath, 'utf8');
    let changed = false;

    // PostgreSQL
    if (ymlContent.includes('jdbc:postgresql://')) {
      ymlContent = ymlContent.replace(/jdbc:postgresql:\/\/[^:]+:5432\/vrakben_db/g, 'jdbc:postgresql://${DB_HOST:infra.vrakben.local}:5432/vrakben_db');
      changed = true;
    }
    // Eureka
    if (ymlContent.includes('eureka-server:8761')) {
      ymlContent = ymlContent.replace(/http:\/\/[a-zA-Z0-9_-]+:8761\/eureka\/?/g, 'http://${EUREKA_HOST:eureka.vrakben.local}:8761/eureka/');
      changed = true;
    }
    // Redis
    if (ymlContent.includes('vrakben-redis') || ymlContent.includes('host: localhost')) {
      ymlContent = ymlContent.replace(/host:\s*vrakben-redis/g, 'host: ${REDIS_HOST:infra.vrakben.local}');
      changed = true;
    }
    // RabbitMQ
    if (ymlContent.includes('vrakben-rabbitmq')) {
      ymlContent = ymlContent.replace(/host:\s*vrakben-rabbitmq/g, 'host: ${RABBIT_HOST:infra.vrakben.local}');
      changed = true;
    }

    // Add Actuator endpoint if not present
    if (!ymlContent.includes('management:') && svc !== 'Backend/eureka-server') {
      ymlContent += `\n\nmanagement:\n  endpoints:\n    web:\n      exposure:\n        include: health,info\n`;
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(ymlPath, ymlContent);
      console.log(`Updated YML for ${svc}`);
    }
  }
});
console.log("Migration script finished.");
