using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace AjaxJson.Models
{
	public class Employee
	{
		public int Id { get; set; }

		[Display(Name = "Фамилия")]
		[StringLength(100)]
		public string FirstName { get; set; }

		[Display(Name = "Имя")]
		[StringLength(100)]
		public string LastName { get; set; }

		[Display(Name = "Дата рождения")]
		[DataType(DataType.Date)]
		[Remote("ValidateBirthDate", "Employees")]
		[DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
		public DateTime BirthDate { get; set; }

		[Display(Name = "Дата приема на работу")]
		[DataType(DataType.Date)]
		[Remote("ValidateHireDate", "Employees")]
		[DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
		public DateTime HireDate { get; set; }

		[Display(Name = "Проектный менеджер")]
		public int? PM { get; set; }

		[Display(Name = "Ресурсный менеджер")]
		public int? RM { get; set; }

		[Display(Name = "Это РМ")]
		public Boolean IsRM { get; set; }

		[Display(Name = "Это ПМ")]
		public Boolean IsPM { get; set; }

		[Display(Name = "Технологии")]
		public string Technology { get; set; }

		[Display(Name = "Фотография")]
		public string Image { get; set; }
	}
}
