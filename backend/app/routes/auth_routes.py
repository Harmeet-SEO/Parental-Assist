#the aim of this route is for authentication, so the users don't log in to the admin dashboard

from flask import Blueprint, request, redirect, session, render_template, flash, url_for
from werkzeug.security import check_password_hash
from app import mongo

bp = Blueprint('auth_routes', __name__, url_prefix='/auth')

@bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        admin = mongo.db.admins.find_one({'username': username})
        if admin and check_password_hash(admin['password'], password):
            session['admin'] = username
            return redirect(url_for('admin_routes.dashboard'))

        flash('Invalid login credentials', 'danger')

    return render_template('auth/login.html')


@bp.route('/logout')
def logout():
    session.pop('admin', None)
    return redirect(url_for('auth_routes.login'))
