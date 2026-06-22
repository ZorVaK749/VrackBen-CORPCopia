package ms_appointment_scheduler.appointment_scheduler.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "appointments")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerUsername;
    private String serviceType;
    private String vehicleBrand;
    private String vehicleModel;
    private String vehiclePlate;
    private String appointmentDate;
    private String appointmentTime;
    private String notes;
    private String status;
}
