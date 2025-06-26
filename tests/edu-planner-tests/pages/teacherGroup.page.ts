export class TeacherGroupPage {
  constructor(private page: any) {}

  async goto() {
    await this.page.click('text=Організація');
    await this.page.click('text=Викладачі');
  }

  async addTeacher({ name, email, group }: { name: string; email: string; group: string }) {
    await this.page.click('text=Додати викладача');
    await this.page.fill('#name', name);
    await this.page.fill('#email', email);
    await this.page.selectOption('#group', group);
    await this.page.click('button:text("Зберегти")');
  }
}
