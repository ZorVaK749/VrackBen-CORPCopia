package ms_appointment_scheduler.appointment_scheduler;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients // CRUCIAL para la comunicación inter-servicio
public class AppointmentSchedulerApplication {
    public static void main(String[] args) {
        SpringApplication.run(AppointmentSchedulerApplication.class, args);
    }
}
