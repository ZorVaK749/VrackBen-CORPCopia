package ms_appointment_scheduler.appointment_scheduler.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentResponseDTO {
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
