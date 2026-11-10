import { useState, useMemo, useEffect } from "react"
import { Plus, Trash2, Search, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useGetPharmacyMedicines, useAddPharmacyMedicine, useUpdatePharmacyMedicine, useDeletePharmacyMedicine, useGetPharmacyMedicineCategories, useUpdatePharmacyMedicineQuantity } from "@/queries"

import { toast } from 'react-toastify';
import type { PharmacyMedicine, AddPharmacyMedicine } from "@/types"

export default function ProductList() {
  const { data: medicines, refetch } = useGetPharmacyMedicines()
  const { data: medicineCategories } = useGetPharmacyMedicineCategories()
  const { mutate: addMedicine } = useAddPharmacyMedicine()
  const { mutate: updateMedicine } = useUpdatePharmacyMedicine()
  const { mutate: deleteMedicine } = useDeletePharmacyMedicine()
  const { mutate: updatePharmacyMedicineQuantity } = useUpdatePharmacyMedicineQuantity()


  const [products, setProducts] = useState<PharmacyMedicine[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isEditQuantityDialogOpen, setIsEditQuantityDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<(AddPharmacyMedicine & { id: number }) | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [deletingProductIds, setDeletingProductIds] = useState<string[]>([])


  const itemsPerPage = 15

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    volume: "",
    details: "",
    price: "",
    quantity: "",
    medicineCategoryId: 0,
    status: "active",
    type: "",
    expirationDate: ""
  })

  const [quantityFormData, setQuantityFormData] = useState({
    quantity: "",
  })

 // Filter and search products
const filteredProducts = useMemo(() => {
  if (!medicines) return [];

  return medicines
    .filter((product: AddPharmacyMedicine) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a: any, b: any) => {
      // Sort by createdAt if available, fallback to id
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return b.id - a.id;
    });
}, [medicines, searchTerm]);



  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  useEffect(() => {
  setCurrentPage(1);
}, [searchTerm]);


  // write the function to handle adding a new product and show a toast notification
  const handleAddProduct = () => {
    setIsLoading(true);

    const payload = {
      ...formData,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
    };

    addMedicine(payload, {
      onSuccess: () => {
        toast.success("Product added successfully!");
        setFormData({
          name: "",
          volume: "",
          details: "",
          price: "",
          quantity: "",
          medicineCategoryId: 0,
          status: "active",
          type: "",
          expirationDate: ""
        });
        setIsAddDialogOpen(false);
        refetch();
      },
      onError: (error: any) => {
        const errMsg = error?.response?.data?.message;
        toast.error("Failed to add product. Please try again. " + errMsg);
      },
      onSettled: () => {
        setIsLoading(false);
      }
    });
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;

    setIsLoading(true);

    const payload = {
      name: formData.name,
      volume: formData.volume,
      details: formData.details,
      quantity: Number(formData.quantity),
      medicineCategoryId: formData.medicineCategoryId,
      price: Number(formData.price),
      status: formData.status,
      type: formData.type,
      expirationDate: formData.expirationDate,
    };

    updateMedicine(
      {
        medicineId: editingProduct.id, // <-- passed in URL
        data: {
          ...payload,
          // Optional: if your backend expects snake_case, see below
          medicine_category_id: payload.medicineCategoryId,
          expiration_date: payload.expirationDate,
        } as any, // use a transformer function instead ideally
      },
      {
        onSuccess: () => {
          toast.success("Product updated successfully!");
          setIsEditDialogOpen(false);
          setEditingProduct(null);
          refetch();
        },
        onError: (error: any) => {
          const errMsg = error?.response?.data?.message;
          toast.error("Failed to update product. Please try again. " + errMsg);
        },
        onSettled: () => {
          setIsLoading(false);
          setFormData({
            name: "",
            volume: "",
            details: "",
            price: "",
            quantity: "",
            medicineCategoryId: 0,
            status: "active",
            type: "",
            expirationDate: ""
          });
        }
      }
    );
  };



   const handleUpdateQuantity = () => {
    if (!editingProduct) return;

    setIsLoading(true);

    const payload = {
      quantity: Number(quantityFormData.quantity),
    };

    updatePharmacyMedicineQuantity(
      {
        medicineId: editingProduct.id, // <-- passed in URL
        data: {
          ...payload,
        } as any, // use a transformer function instead ideally
      },
      {
        onSuccess: () => {
          toast.success("Product updated successfully!");
          setIsEditQuantityDialogOpen(false);
          setEditingProduct(null);
          refetch();
        },
        onError: (error: any) => {
          const errMsg = error?.response?.data?.message;
          toast.error("Failed to update product. Please try again. " + errMsg);
        },
        onSettled: () => {
          setIsLoading(false);
          setQuantityFormData({
            quantity: "",
          });
        }
      }
    );
  };







  const openEditDialog = (product: PharmacyMedicine) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      volume: product.volume ?? "",
      details: product.details ?? "",
      price: product.price.toString(),
      quantity: product.quantity.toString() ?? "",
      medicineCategoryId: product.medicineCategoryId,
      status: product.status,
      type: product.type ?? "",
      expirationDate: product.expirationDate ?? "",
    })
    setIsEditDialogOpen(true)
  }

    const openEditQuantityDialog = (product: PharmacyMedicine) => {
    setEditingProduct(product)
    setQuantityFormData({
      quantity: product.quantity.toString() ?? "",
    })
    setIsEditQuantityDialogOpen(true)
  }


  // write the function to handle delete a product and show a toast notification
  const handleDeleteProduct = async (productId: string) => {
    setDeletingProductIds(prev => [...prev, productId])

    // Simulate API call using deleteMedicine mutation
    await new Promise((resolve) => setTimeout(resolve, 1500))

    deleteMedicine(Number(productId), {

      onSuccess: () => {
        refetch()
        setProducts(products.filter((p) => p.id !== Number(productId)))
        setDeletingProductIds(prev => prev.filter(id => id !== productId))
        toast.success("Product deleted successfully!")
      },
      onError: (error: any) => {
        setDeletingProductIds(prev => prev.filter(id => id !== productId))
         const errMsg = error?.response?.data?.message;
        toast.error(`Failed to delete product. Please try again. ` + errMsg);
      },
    })
  }

  return (
    <div className="md:p-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-teal-700">Add New Product</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter Product name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="volume">Product Volume</Label>
                  <Input
                    id="volume"
                    placeholder="Enter Product volume"
                    value={formData.volume}
                    onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="details">Product Details</Label>
                  <Input
                    id="details"
                    placeholder="Enter Product details"
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price (₦)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="Enter price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Stock Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="Enter quantity"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="medicineCategoryId">Category</Label>
                  <Select
                    value={formData.medicineCategoryId ? String(formData.medicineCategoryId) : ""}
                    onValueChange={(value) => setFormData({ ...formData, medicineCategoryId: Number(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {medicineCategories?.map((category) => (
                        <SelectItem key={category.id} value={String(category.id)}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="type">Product Type</Label>
                  <Input
                    id="type"
                    placeholder="Enter Product type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="expirationDate">Product Expiration Date</Label>
                  <Input
                    id="expirationDate"
                    placeholder="Enter Product expirationDate (YYYY/MM/DD)"
                    value={formData.expirationDate}
                    onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddProduct}
                    disabled={isLoading || !formData.name || !formData.price || !formData.quantity || !formData.medicineCategoryId}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? "Adding..." : "Add Product"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12">
              </TableHead>
              <TableHead className="text-teal-700 font-semibold">Name</TableHead>
              <TableHead className="text-teal-700 font-semibold">Price</TableHead>
              <TableHead className="text-teal-700 font-semibold">Stock</TableHead>
              <TableHead className="text-teal-700 font-semibold">Status</TableHead>
              <TableHead className="text-teal-700 font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.map((product: PharmacyMedicine) => (
              <TableRow key={product.id} className="hover:bg-gray-50">
                <TableCell>
                </TableCell>
                <TableCell className="font-medium text-teal-700">{product.name}</TableCell>
                <TableCell>₦ {product.price.toLocaleString()}</TableCell>
                <TableCell>
                  {product.quantity}
                  <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditQuantityDialog(product)}
                      className="h-8 w-8 text-gray-600 hover:text-gray-900"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                </TableCell>
                <TableCell>
                  {product.status}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(product)}
                      className="h-8 w-8 text-gray-600 hover:text-gray-900"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteProduct(String(product.id))}
                      disabled={deletingProductIds.includes(String(product.id))}
                      className="h-8 w-auto text-red-600 hover:text-red-900 px-2"
                    >
                      {deletingProductIds.includes(String(product.id)) ? "Deleting..." : <Trash2 className="w-4 h-4" />}
                    </Button>


                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center space-x-2 mt-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentPage(page)}
            className={currentPage === page ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {page}
          </Button>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-teal-700">Edit Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Product Name</Label>
              <Input
                id="edit-name"
                placeholder="Enter Product name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-volume">Product Volume</Label>
              <Input
                id="edit-volume"
                placeholder="Enter Product volume"
                value={formData.volume}
                onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-details">Product Details</Label>
              <Input
                id="edit-details"
                placeholder="Enter Product details"
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-price">Price (₦)</Label>
              <Input
                id="edit-price"
                type="number"
                placeholder="Enter price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-quantity">Stock Quantity</Label>
              <Input
                id="edit-quantity"
                type="number"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-category">Category</Label>
              <Select
                value={formData.medicineCategoryId ? String(formData.medicineCategoryId) : ""}
                onValueChange={(value) => setFormData({ ...formData, medicineCategoryId: Number(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a Category" />
                </SelectTrigger>
                <SelectContent>
                  {medicineCategories?.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-type">Product Type</Label>
              <Input
                id="edit-type"
                placeholder="Enter Product type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="edit-expirationDate">Product Expiration Date</Label>
              <Input
                id="edit-expirationDate"
                placeholder="Enter Product expirationDate"
                value={formData.expirationDate}
                onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleUpdateProduct}
                disabled={isLoading || !formData.name || !formData.price || !formData.quantity || !formData.medicineCategoryId}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? "Updating..." : "Update Product"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>


       {/* Edit Dialog */}
      <Dialog open={isEditQuantityDialogOpen} onOpenChange={setIsEditQuantityDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-teal-700">Edit Quantity</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-quantity">Stock Quantity</Label>
              <Input
                id="edit-quantity"
                type="number"
                placeholder="Enter quantity"
                value={quantityFormData.quantity}
                onChange={(e) => setQuantityFormData({ ...quantityFormData, quantity: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditQuantityDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleUpdateQuantity}
                disabled={isLoading || !quantityFormData.quantity}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? "Updating..." : "Update Quantity"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
