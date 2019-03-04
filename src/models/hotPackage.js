import { resourceCRUD } from '@/api/lesson'

const packageCRUD = resourceCRUD('packages')
const packageSortCRUD = resourceCRUD('packageSorts')

export default function hotPackageModel() {
  return {
    async list(params) {
      const hotPackages = await packageSortCRUD.list(params)
      const packagesId = hotPackages.rows.map(item => item.packageId)
      const packages = await packageCRUD.list({
        limit: 200,
        where: {
          id: {
            $in: packagesId
          }
        }
      })
      const packageMap = new Map()
      packages.rows.forEach(item => packageMap.set(item.id, item.packageName))
      const finalHotPackages = hotPackages.rows.map(item => {
        return {
          ...item,
          packageName: packageMap.get(item.packageId)
        }
      })

      return {
        count: hotPackages.count,
        rows: finalHotPackages
      }
    },
    async create(params) {
      return packageSortCRUD.create(params)
    },
    async update(params) {
      return packageSortCRUD.update(params)
    },
    async get(params) {
      return packageSortCRUD.get(params)
    },
    async destroy(params) {
      return packageSortCRUD.destroy(params)
    },
    async destroyAll(params) {
      for (const index of params.ids || []) {
        await this.destroy({ id: index })
      }
    }
  }
}
