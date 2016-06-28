using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using AjaxJson.Models;
using System.IO;

namespace AjaxJson.Controllers
{
    public class EmployeesController : Controller
    {
        private EmployeeContext db = new EmployeeContext();

        // GET: Employees
        public ActionResult Index()
        {
            return View(db.Employees.ToList());
        }

        // GET: Employees/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Employee employee = db.Employees.Find(id);
            if (employee == null)
            {
                return HttpNotFound();
            }
			return PartialView(employee);
        }

        // GET: Employees/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Employees/Create
        // Чтобы защититься от атак чрезмерной передачи данных, включите определенные свойства, для которых следует установить привязку. Дополнительные 
        // сведения см. в статье http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,FirstName,LastName,BirthDate,HireDate,PM,RM,IsRM,IsPM,Technology")] Employee employee)
        {
            if (ModelState.IsValid)
            {
	            if (String.IsNullOrEmpty(employee.Image))
	            {
		            employee.Image = "0.png";
	            }
				db.Employees.Add(employee);
                db.SaveChanges();
                return RedirectToAction("Index");
            }
			SelectList rms = new SelectList(db.Employees.Where(e => e.IsRM == true).ToList(), "Id", "FirstName", employee.RM);
			SelectList pms = new SelectList(db.Employees.Where(e => e.IsPM == true).ToList(), "Id", "FirstName", employee.PM);
			ViewBag.RMs = rms;
			ViewBag.PMs = pms;

			return View(employee);
        }

		[HttpGet]
        // GET: Employees/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Employee employee = db.Employees.Find(id);
            if (employee == null)
            {
                return HttpNotFound();
            }
			SelectList rms = new SelectList(db.Employees.Where(e => e.IsRM == true).ToList(), "Id", "FirstName", employee.RM);
			SelectList pms = new SelectList(db.Employees.Where(e => e.IsPM == true).ToList(), "Id", "FirstName", employee.PM);
			ViewBag.RMs = rms;
			ViewBag.PMs = pms;

			return PartialView(employee);
        }

        // POST: Employees/Edit/5
        // Чтобы защититься от атак чрезмерной передачи данных, включите определенные свойства, для которых следует установить привязку. Дополнительные 
        // сведения см. в статье http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
		public ActionResult Edit(/*[Bind(Include = "Id,FirstName,LastName,BirthDate,HireDate,PM,RM,IsRM,IsPM,Technology")]*/ Employee employee)
		{
	        if (ModelState.IsValid)
            {
				db.Entry(employee).State = EntityState.Modified;
                db.SaveChanges();
                return PartialView("Index", db.Employees.ToList());
            }
            return View(employee);
        }

		[HttpPost]
		public string Upload()
		{
			var upload = Request.Files["Image"];
				if (upload != null)
				{
					// получаем имя файла
					string fileName = System.IO.Path.GetFileName(upload.FileName);
					// сохраняем файл в папку Files в проекте
					upload.SaveAs(Server.MapPath("~/Content/Images/" + fileName));
					return fileName;
				}
			return "";
		}

		// GET: Employees/Delete/5
		public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Employee employee = db.Employees.Find(id);
            if (employee == null)
            {
                return HttpNotFound();
            }
            return PartialView(employee);
        }

        // POST: Employees/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            Employee employee = db.Employees.Find(id);
            db.Employees.Remove(employee);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

		public JsonResult ValidateHireDate(DateTime HireDate)
		{
			if (HireDate < new DateTime(1993,12, 23) || HireDate > DateTime.Now)
			{
				return Json("Введите дату после 23.12.1993, не превышающую текущую",
					JsonRequestBehavior.AllowGet);
			}
			else
			{
				return Json(true, JsonRequestBehavior.AllowGet);
			}
		}

		public JsonResult ValidateBirthDate(DateTime BirthDate)
		{
			if (BirthDate > new DateTime(1998, 1, 1) || BirthDate < new DateTime(1951, 1, 1))
			{
				return Json("Введите дату рождения, соответствующую ТК РФ (не ребенок и не пенсионер)",
					JsonRequestBehavior.AllowGet);
			}
			else
			{
				return Json(true, JsonRequestBehavior.AllowGet);
			}
		}

	}
}
