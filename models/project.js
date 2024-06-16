class ProjectDAO {
  columns = ['id', 'name', 'description', 'updated', 'status', 'version'];
  constructor(entry) {
    try {
      this.id = entry.id;
      this.name = entry.name;
      this.description = entry.description;
      this.updated = entry.updated;
      this.status = entry.status;
      this.version = entry.version;
    } catch (e) {
      console.log(e);
    }
  }
  createProject() {
    var command = `INSERT INTO projects (`;
    var values = `) VALUES ( `;
    var args = [];
    for (let i = 0; i < this.columns.length; i++) {
      if (this[this.columns[i]] != undefined) {
        command += this.columns[i] + ', ';
        values += `?, `;
        args.push(this[this.columns[i]]);
      }
    }
    if (args.length > 0) {
      command = command.slice(0, -2);
      values = values.slice(0, -2);
      command += values + `)`;
    }
    return [command, args];
  }
}

export default ProjectDAO;
