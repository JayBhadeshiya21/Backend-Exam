const Role = require("./models/Roles");

const seedRoles = async () => {
  const roles = ["MANAGER", "SUPPORT", "USER"];

  for (let roleName of roles) {
    const existingRole = await Role.findOne({ name: roleName });

    if (!existingRole) {
      await Role.create({ name: roleName });
      console.log(`${roleName} created`);
    }
  }
};

module.exports = seedRoles;