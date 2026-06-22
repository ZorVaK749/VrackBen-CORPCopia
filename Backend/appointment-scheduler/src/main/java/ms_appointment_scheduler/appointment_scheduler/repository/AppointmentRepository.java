package ms_appointment_scheduler.appointment_scheduler.repository;

import ms_appointment_scheduler.appointment_scheduler.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
}