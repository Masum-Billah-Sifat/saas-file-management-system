import { HttpError } from "../../utils/httpError";
import { packagesRepo } from "./packages.repo";

export const packagesService = {
  async create(data: any) {
    return packagesRepo.create(data);
  },

  async listAdmin() {
    return packagesRepo.listAdmin();
  },

  async listActive() {
    return packagesRepo.listActive();
  },

  async update(id: string, data: any) {
    const pkg = await packagesRepo.findById(id);
    if (!pkg) throw new HttpError(404, "Package not found");

    if (pkg.isSystem) {
      // Free: allow updating limits but not deactivating
      if (data.isActive === false) throw new HttpError(400, "System package cannot be deactivated");
      if (data.name && data.name !== pkg.name) throw new HttpError(400, "System package name cannot be changed");
    }

    return packagesRepo.update(id, data);
  },

  async delete(id: string) {
    const pkg = await packagesRepo.findById(id);
    if (!pkg) throw new HttpError(404, "Package not found");
    if (pkg.isSystem) throw new HttpError(400, "System package cannot be deleted/deactivated");
    return packagesRepo.deactivate(id);
  },
};