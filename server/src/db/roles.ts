import { getConnection } from './db';
import { Roles, Userroles } from './dbTable';

export async function getRolesById(id: string): Promise<Roles[]> {
  const connection = await getConnection();

  const userRoles = connection.getRepository(Userroles);
  const roles = await userRoles.find({
    relations: ['user', 'role'],
    where: { user: id },
  });

  return roles.map((r) => r.role);
}
