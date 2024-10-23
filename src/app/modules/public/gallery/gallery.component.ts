import {Component, Input} from '@angular/core';
import {NgForOf} from "@angular/common";
interface Photo {
  src: string;
  alt: string;
}
@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent {
  @Input() photos: Photo[] = [
    { src: "/assets/images/placeholder.svg", alt: "Bruschetta" },
    { src: "/assets/images/placeholder.svg", alt: "Steak" },
    { src: "/assets/images/placeholder.svg", alt: "Tiramisu" },
    { src: "/assets/images/placeholder.svg", alt: "Calamari" },
    { src: "/assets/images/placeholder.svg", alt: "Salmon" },
    { src: "/assets/images/placeholder.svg", alt: "Cheesecake" },
  ];
}
