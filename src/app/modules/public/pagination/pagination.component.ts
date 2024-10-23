import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pagination-container">
      <button
        [disabled]="currentPage === 0"
        (click)="onPageChange(currentPage - 1)"
        class="pagination-button"
      >
        Previous
      </button>

      <span class="pagination-info">
        Page {{currentPage + 1}} of {{totalPages}}
      </span>

      <button
        [disabled]="currentPage === totalPages - 1"
        (click)="onPageChange(currentPage + 1)"
        class="pagination-button"
      >
        Next
      </button>
    </div>
  `,
  styles: [`
    .pagination-container {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin: 2rem 0;
    }

    .pagination-button {
      padding: 0.5rem 1rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      background-color: #fff;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover:not(:disabled) {
        background-color: #f0f0f0;
      }

      &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }
    }

    .pagination-info {
      font-size: 0.9rem;
      color: #666;
    }
  `]
})
export class PaginationComponent {
  @Input() currentPage: number = 0;
  @Input() totalPages: number = 0;
  @Output() pageChange = new EventEmitter<number>();

  onPageChange(page: number): void {
    this.pageChange.emit(page);
  }
}
