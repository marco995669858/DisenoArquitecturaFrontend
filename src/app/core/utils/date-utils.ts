/** Convierte una fecha ISO ('yyyy-MM-dd', tal como la envía el backend) a Date para p-datepicker. */
export function toDateInput(iso?: string | null): Date | null {
    if (!iso) return null;
    const [year, month, day] = iso.split('-').map(Number);
    return new Date(year, month - 1, day);
}

/** Convierte un Date de p-datepicker a 'yyyy-MM-dd' (LocalDate ISO) para enviar al backend. */
export function fromDateInput(date?: Date | null): string | null {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/** Periodo actual en formato 'yyyy-MM', tal como lo espera el backend (LecturaMedidor, Prorrateo, Liquidacion). */
export function periodoActual(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}
