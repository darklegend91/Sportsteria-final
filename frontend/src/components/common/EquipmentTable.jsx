import React from "react";

export default function EquipmentTable({ equipments = [], showActions = false, onRequest, onDelete, quantityMap = {}, onQuantityChange }) {
  const handleQuantityInput = (equipmentId, value) => {
    if (onQuantityChange) {
      onQuantityChange(equipmentId, value);
    }
  };

  return (
    <div className="overflow-x-auto shadow-md rounded-lg bg-white border border-gray-200">
      <table className="w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm uppercase tracking-wider">
          <tr>
            <th className="px-6 py-4 text-left font-semibold">Equipment Name</th>
            <th className="px-6 py-4 text-center font-semibold">Total Quantity</th>
            <th className="px-6 py-4 text-center font-semibold">Allotted Quantity</th>
            <th className="px-6 py-4 text-center font-semibold">Available Quantity</th>
            {showActions && onRequest && <th className="px-6 py-4 text-center font-semibold">Request Quantity</th>}
            {showActions && <th className="px-6 py-4 text-center font-semibold">Actions</th>}
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm divide-y divide-gray-100">
          {equipments.length === 0 && (
            <tr>
              <td colSpan={showActions ? (onRequest ? 6 : 5) : 4} className="p-8 text-center text-gray-400 font-medium">
                No equipment available
              </td>
            </tr>
          )}
          {equipments.map((eq, idx) => {
            const total = eq.totalQuantity ?? eq.quantity ?? 0;
            const allotted = eq.allottedQuantity ?? eq.allotted ?? 0;
            const available = total - allotted;
            return (
              <tr
                key={eq.id}
                className={`transition-colors ${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50`}
              >
                <td className="px-6 py-4 font-semibold text-gray-800">{eq.name}</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                    {total}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-medium">
                    {allotted}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-block px-3 py-1 rounded-full font-medium ${
                    available > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {available}
                  </span>
                </td>
                {showActions && onRequest && (
                  <td className="px-6 py-4 text-center">
                    <input
                      type="number"
                      min="1"
                      max={available}
                      value={quantityMap[eq.id] || 1}
                      onChange={(e) => handleQuantityInput(eq.id, e.target.value)}
                      disabled={available === 0}
                      className="w-20 p-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </td>
                )}
                {showActions && (
                  <td className="px-6 py-4 flex gap-2 justify-center flex-wrap">
                    {onRequest && (
                      <button
                        onClick={() => onRequest(eq.id)}
                        disabled={available === 0}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        Request
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(eq.id)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow transition font-medium text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
