
import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from './services/product.service';
import { CategoryService, Category } from './services/category.service';
import { MovementService, Movement } from './services/movement.service';
import { DatePipe, CurrencyPipe } from '@angular/common';

@Component({
  standalone: true,
 imports: [RouterOutlet, FormsModule, DatePipe, CurrencyPipe],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit {

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  movements = signal<Movement[]>([]);
  showMovementForm = false;

newMovement = {
  type: 'ENTRADA',
  quantity: 1,
  description: '',
  product: {
    id: 0
  }
};
  showCategoryForm = false;
  editingCategoryId: number | null = null;

newCategory = {
  name: '',
  description: ''
};

  searchTerm = '';
  selectedFilter = 'all';

  selectedSection = 'dashboard';

changeSection(section: string): void {
  this.selectedSection = section;
  this.closeForm();
  this.closeCategoryForm();
}
openCategoryForm(): void {
  this.showCategoryForm = true;
  this.editingCategoryId = null;

  this.newCategory = {
    name: '',
    description: ''
  };
}
openMovementForm(): void {
  this.showMovementForm = true;

  this.newMovement = {
    type: 'ENTRADA',
    quantity: 1,
    description: '',
    product: {
      id: 0
    }
  };
}
closeMovementForm(): void {
  this.showMovementForm = false;
}
createMovement(): void {
  if (this.newMovement.product.id === 0) {
    alert('Debes seleccionar un producto');
    return;
  }

  if (this.newMovement.quantity <= 0) {
    alert('La cantidad debe ser mayor que cero');
    return;
  }

  this.movementService.createMovement(this.newMovement).subscribe({
    next: () => {
      this.loadMovements();
      this.loadProducts();
      this.closeMovementForm();
      alert('Movimiento registrado correctamente');
    },
    error: (error) => {
      console.error('Error al registrar movimiento:', error);
      alert(error.error?.message || 'No se pudo registrar el movimiento');
    }
  });
}

closeCategoryForm(): void {
  this.showCategoryForm = false;
}
openEditCategory(category: Category): void {
  this.editingCategoryId = category.id!;
  this.newCategory = {
    name: category.name,
    description: category.description
  };
  this.showCategoryForm = true;
}

get filteredProducts(): Product[] {
  return this.products().filter(product => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(this.searchTerm.toLowerCase());

    let matchesFilter = true;

    if (this.selectedFilter === 'low') {
      matchesFilter = product.stock > 0 && product.stock <= 5;
    }

    if (this.selectedFilter === 'out') {
      matchesFilter = product.stock === 0;
    }

    return matchesSearch && matchesFilter;
  });
}

  newProduct = {
    name: '',
    description: '',
    price: 0,
    stock: 0
  };

  editingProductId: number | null = null;

  showCreateForm = false;

openCreateForm(): void {
  this.showCreateForm = true;
  this.editingProductId = null;

  this.successMessage.set('');
  this.errorMessage.set('');

  this.newProduct = {
    name: '',
    description: '',
    price: 0,
    stock: 0
  };
}

closeForm(): void {
  this.showCreateForm = false;
  this.editingProductId = null;
}

successMessage = signal('');
errorMessage = signal('');

  get inventoryValue(): number {
  return this.products().reduce(
    (total, product) => total + (product.price * product.stock),
    0
  );
}

get lowStockProducts(): number {
  return this.products().filter(
    product => product.stock <= 5
  ).length;
}

get availableProducts(): number {
  return this.products().filter(
    product => product.stock > 0
  ).length;
}
getStockPercentage(stock: number): number {
  const maxStock = Math.max(
    ...this.products().map(product => product.stock),
    1
  );

  return (stock / maxStock) * 100;
}

  editProductData = {
    name: '',
    description: '',
    price: 0,
    stock: 0
  };

constructor(
  private productService: ProductService,
  private categoryService: CategoryService,
  private movementService: MovementService
) {}

ngOnInit(): void {
  this.loadProducts();
  this.loadCategories();
  this.loadMovements();
}
loadCategories(): void {
  this.categoryService.getAllCategories().subscribe({
    next: (data) => {
      this.categories.set(data);
      console.log('Categorías cargadas:', data);
    },
    error: (error) => {
      console.error('Error al cargar las categorías:', error);
    }
  });
}
loadMovements(): void {
  this.movementService.getAllMovements().subscribe({
    next: (data) => {
      this.movements.set(data);
    },
    error: (error) => {
      console.error('Error al cargar movimientos:', error);
    }
  });
}
saveCategory(): void {
  if (!this.newCategory.name.trim()) {
    alert('Debes ingresar el nombre de la categoría');
    return;
  }

  if (this.editingCategoryId === null) {
    this.categoryService.createCategory(this.newCategory).subscribe({
      next: () => {
        this.loadCategories();
        this.closeCategoryForm();
        alert('Categoría creada correctamente');
      },
      error: (error) => {
        console.error('Error al crear categoría:', error);
        alert('No se pudo crear la categoría');
      }
    });
  } else {
    this.categoryService.updateCategory(
      this.editingCategoryId,
      this.newCategory
    ).subscribe({
      next: () => {
        this.loadCategories();
        this.closeCategoryForm();
        this.editingCategoryId = null;
        alert('Categoría actualizada correctamente');
      },
      error: (error) => {
        console.error('Error al actualizar categoría:', error);
        alert('No se pudo actualizar la categoría');
      }
    });
  }
}
deleteCategory(categoryId: number): void {
  const confirmed = confirm('¿Estás seguro de eliminar esta categoría?');

  if (!confirmed) {
    return;
  }

  this.categoryService.deleteCategory(categoryId).subscribe({
    next: () => {
      this.loadCategories();
      alert('Categoría eliminada correctamente');
    },
    error: (error) => {
      console.error('Error al eliminar categoría:', error);
      alert('No se pudo eliminar la categoría');
    }
  });
}

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        console.log('Productos cargados:', data);
      },
      error: (error) => {
        console.error('Error al cargar los productos:', error);
      }
    });
  }

 createProduct(): void {
  this.successMessage.set('');
  this.errorMessage.set('');

  console.log('Datos enviados:', JSON.stringify(this.newProduct, null, 2));

  this.productService.createProduct(this.newProduct).subscribe({
    next: (product) => {
  console.log('Producto creado:', product);
  this.successMessage.set('¡Producto registrado correctamente!');
  this.newProduct = { name: '', description: '', price: 0, stock: 0 };
  this.closeForm();
  this.loadProducts();
},
    error: (error) => {
      console.error('Detalle del error:', error.error);
      this.errorMessage.set('No fue posible registrar el producto. Verifica los datos e intenta nuevamente.');
    }
  });
}

  startEdit(product: Product): void {
  this.editingProductId = product.id;
  this.showCreateForm = true;

  this.successMessage.set('');
  this.errorMessage.set('');

  this.editProductData = {
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock
  };
}

  saveEdit(): void {
  if (this.editingProductId === null) {
    return;
  }

  this.successMessage.set('');
  this.errorMessage.set('');

  this.productService.updateProduct(
    this.editingProductId,
    this.editProductData
  ).subscribe({
    next: () => {
      console.log('Producto actualizado correctamente');

      this.successMessage.set('¡Producto actualizado correctamente!');

      this.closeForm();
      this.loadProducts();
    },
    error: (error) => {
      console.error('Error al actualizar el producto:', error);
      this.errorMessage.set('No fue posible actualizar el producto.');
    }
  });
}

  deleteProduct(id: number): void {
  const confirmed = confirm('¿Estás seguro de eliminar este producto?');

  if (!confirmed) {
    return;
  }

  this.productService.deleteProduct(id).subscribe({
    next: () => {
      console.log('Producto eliminado correctamente');
      this.loadProducts();
    },
    error: (error) => {
      console.error('Error al eliminar el producto:', error);
    }
  });
}
}
