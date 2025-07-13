import { Component } from "react";

export class LoadingSpinner extends Component {
  render() {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div
            className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-yellow-400 rounded-full animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          ></div>
        </div>
        <span className="ml-3 text-gray-600 font-medium">
          Searching the galaxy...
        </span>
      </div>
    );
  }
}
